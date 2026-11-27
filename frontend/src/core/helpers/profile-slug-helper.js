const PROFILE_SLUG_SEPARATOR = '-'

const canonicalLocation = (route, profile) => {
  const profileSlug = route.params.profileSlug
  return profileSlug === profile.profileSlug ? undefined : internals.buildLocation(route, profile)
}

const toSlug = profileSlug => {
  return profileSlug.split(PROFILE_SLUG_SEPARATOR)[0]
}

export const profileSlugHelper = {
  canonicalLocation,
  toSlug,
}

const buildLocation = (route, profile) => {
  const query = { ...route.query }
  if (internals.isRenamed(route.params.profileSlug, profile)) {
    query.renamed = '1'
  }

  return {
    name: route.name,
    params: { profileSlug: profile.profileSlug },
    query,
  }
}

const isRenamed = (profileSlug, profile) => {
  const name = internals.toName(profileSlug)
  return name !== undefined && name !== internals.toName(profile.profileSlug)
}

const toName = profileSlug => {
  return profileSlug.includes(PROFILE_SLUG_SEPARATOR)
    ? profileSlug.slice(profileSlug.indexOf(PROFILE_SLUG_SEPARATOR) + 1)
    : undefined
}

export const internals = {
  buildLocation,
  isRenamed,
  toName,
}
