module.exports = async ({ context, github }) => {
  const { commits } = context.payload;
  // プルリク番号を取得するためにマージコミットを取得
  const mergeCommit = commits
    .sort((a, b) =>
      Date.parse(a.timestamp) < Date.parse(b.timestamp) ? 1 : -1
    )
    .find((object) => object.message.includes("Merge pull request"));
  console.log(mergeCommit);
  if (!mergeCommit) {
    console.error(
      "merge commitが存在しません。手動でリリースを作成して下さい。"
    );
  }
  const pull_number = mergeCommit.message.split(" ")[3].slice(1);
  console.log("pull_number:", pull_number);

  const { owner, repo } = context.repo;
  // マージしたプルリクのコメントを取得
  const commentList = await github.issues.listComments({
    owner,
    repo,
    issue_number: pull_number,
  });
  console.log(commentList);
  // change logが載っているコメントのidを取得
  const { id } = commentList.data.find((object) =>
    object.body.includes("## Change Log")
  );
  if (!id) {
    console.error("change logが取得できていません。");
  }
  const commentParams = await github.issues.getComment({
    owner,
    repo,
    comment_id: id,
  });
  console.log(commentParams.data.body);

  return commentParams.data.body;
};
