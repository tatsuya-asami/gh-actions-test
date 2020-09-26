module.exports = ({context, github})=> {
  const { owner, repo } = context.repo
  const { data } = await github.repos.listReleases({
    owner,
    repo,
  })
  // 同じbaseブランチのドラフトを除くrelease一覧を抽出し、新しいreleaseから順番に並び替える
  const sortedReleaseList = 
    data
      .filter((object) => !object.draft && object.name.includes(${{ steps.base_branch.outputs.result }}))
      .sort((a, b) => {
        return Date.parse(a.published_at) < Date.parse(b.published_at) ? 1 : -1
      })
  console.log(sortedReleaseList)
  return sortedReleaseList
}