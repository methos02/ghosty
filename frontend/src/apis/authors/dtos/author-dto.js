const fromShow = author => {
  return {
    id: author.id,
    username: author.username,
    slug: author.slug,
    profileSlug: author.profile_slug,
    isDeleted: author.is_deleted,
  }
}

export const AuthorDto = { fromShow }
