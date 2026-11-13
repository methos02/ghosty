const split = (content, usernames) => {
  const mention =
    usernames
      .map(username => `@${username}`)
      .filter(candidate => internals.opensWith(content, candidate))
      .toSorted((first, second) => second.length - first.length)[0] ?? ''

  return {
    mention,
    rest: content.slice(mention.length).trimStart(),
  }
}

export const mentionHelper = {
  split,
}

const opensWith = (content, mention) => {
  if (!content.startsWith(mention)) {
    return false
  }

  return content.length === mention.length || /\s/u.test(content[mention.length])
}

export const internals = {
  opensWith,
}
