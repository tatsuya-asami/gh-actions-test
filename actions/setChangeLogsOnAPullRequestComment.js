module.exports = async ({ context, github }, pullRequestNumber, log) => {
  const { owner, repo } = context.repo;

  // マージしたプルリクのコメントを取得
  const commentList = await github.issues.listComments({
    owner,
    repo,
    issue_number: pullRequestNumber,
  });
  console.log(pullRequestNumber);
  const loggedComment = commentList.data.find((object) =>
    object.body.includes("## Change Log")
  );
  console.log(loggedComment);

  // すでにchange logのコメントがある場合はそれを上書きし、ない場合は新たにコメントを作る
  if (loggedComment) {
    github.issues.updateComment({
      owner,
      repo,
      comment_id: loggedComment.id,
      body: log,
    });
  } else {
    github.issues.createComment({
      owner,
      repo,
      issue_number: pullRequestNumber,
      body: log,
    });
  }
};
