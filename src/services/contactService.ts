import { PrismaClient } from "@prisma/client"
import { buildResponse } from "../utils/buildResponse"

const prisma = new PrismaClient()

export async function identifyContact(email?: string, phone?: string) {

  const matches = await prisma.contact.findMany({
    where: {
      OR: [
        { email: email || undefined },
        { phoneNumber: phone || undefined }
      ]
    }
  })

  if (matches.length === 0) {
    const newContact = await prisma.contact.create({
      data: {
        email,
        phoneNumber: phone,
        linkPrecedence: "primary"
      }
    })

    return buildResponse([newContact])
  }

  const primaryIds = new Set<number>()

  for (let c of matches) {
    if (c.linkPrecedence === "primary") {
      primaryIds.add(c.id)
    } else if (c.linkedId) {
      primaryIds.add(c.linkedId)
    }
  }

  const allContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: { in: Array.from(primaryIds) } },
        { linkedId: { in: Array.from(primaryIds) } }
      ]
    }
  })

  allContacts.sort((a, b) =>
    a.createdAt.getTime() - b.createdAt.getTime()
  )

  const primary = allContacts[0]

  for (let c of allContacts) {
    if (c.id !== primary.id && c.linkPrecedence === "primary") {
      await prisma.contact.update({
        where: { id: c.id },
        data: {
          linkPrecedence: "secondary",
          linkedId: primary.id
        }
      })
    }
  }

  const emailExists = allContacts.some(c => c.email === email)
  const phoneExists = allContacts.some(c => c.phoneNumber === phone)

  if (!emailExists || !phoneExists) {
    await prisma.contact.create({
      data: {
        email,
        phoneNumber: phone,
        linkedId: primary.id,
        linkPrecedence: "secondary"
      }
    })
  }

  const finalContacts = await prisma.contact.findMany({
    where: {
      OR: [
        { id: primary.id },
        { linkedId: primary.id }
      ]
    }
  })

  return buildResponse(finalContacts)
}