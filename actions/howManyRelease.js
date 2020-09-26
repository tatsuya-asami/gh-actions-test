module.exports = async ({ context, github }) => {
  const { owner, repo } = context.repo;
  const { data } = await github.repos.listReleases({
    owner,
    repo,
  });

  // 'yyyy-mm-date'に整形する関数
  const formatDate = (dt) => {
    const y = dt.getFullYear();
    const m = ("00" + (dt.getMonth() + 1)).slice(-2);
    const d = ("00" + dt.getDate()).slice(-2);
    return `${y}-${m}-${d}`;
  };

  // 本日作られた同じbaseブランチのドラフトを除くrelease一覧を抽出し、新しいreleaseから順番に並び替える
  const sortedReleaseList = data
    .filter(
      (object) =>
        !object.draft &&
        object.name.includes("master") &&
        object.published_at.substr(0, 10) === formatDate(new Date())
    )
    .sort((a, b) =>
      Date.parse(a.published_at) < Date.parse(b.published_at) ? 1 : -1
    );
  console.log(sortedReleaseList.length);
  return sortedReleaseList.length;
};
