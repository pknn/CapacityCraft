const pushToClipboard = (
  value: string,
  onSuccess: () => void = () => {},
  onFailure: () => void = () => {}
) => {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      onSuccess();
    })
    .catch(() => {
      onFailure();
    });
};

export default pushToClipboard;
