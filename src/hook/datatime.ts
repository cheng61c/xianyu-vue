export const useDateTimePattern = (value: string) => {
  const commentDate = new Date(value);
  const now = new Date();
  const year = commentDate.getFullYear();
  const mouth = commentDate.getMonth() + 1;
  const day = commentDate.getDate();
  const hour = commentDate.getHours();
  const minute = commentDate.getMinutes();
  return year === now.getFullYear()
    ? `${mouth}-${day} ${hour}:${minute}`
    : `${year}-${mouth}-${day} ${hour}:${minute}`;
};

export const useDateTimePattern2 = (value: number) => {
  const commentDate = new Date(value);
  const now = new Date();
  const year = commentDate.getFullYear();
  const mouth = commentDate.getMonth() + 1;
  const day = commentDate.getDate();
  const hour = commentDate.getHours();
  const minute = commentDate.getMinutes();
  return year === now.getFullYear()
    ? `${mouth}-${day} ${hour}:${minute}`
    : `${year}-${mouth}-${day} ${hour}:${minute}`;
};
