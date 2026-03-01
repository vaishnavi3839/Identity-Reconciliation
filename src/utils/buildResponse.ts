export function buildResponse(contacts: any[]) {

  const primary = contacts.find(c => c.linkPrecedence === "primary")

  const emails: string[] = []
  const phones: string[] = []
  const secondaryIds: number[] = []

  for (let c of contacts) {
    if (c.email && !emails.includes(c.email)) {
      emails.push(c.email)
    }

    if (c.phoneNumber && !phones.includes(c.phoneNumber)) {
      phones.push(c.phoneNumber)
    }

    if (c.linkPrecedence === "secondary") {
      secondaryIds.push(c.id)
    }
  }

  return {
    contact: {
      primaryContatctId: primary.id,
      emails,
      phoneNumbers: phones,
      secondaryContactIds: secondaryIds
    }
  }
}