export default function scoreToLevel(scoreText) {
  const score = parseFloat(scoreText);
  /* eslint-disable no-else-return */
  if (score < 40) {
    return 'poor';
  } else if (score < 60) {
    return 'bad';
  } else if (score < 70) {
    return 'soso';
  } else if (score < 80) {
    return 'good';
  } else if (score < 90) {
    return 'great';
  }
  return 'excellent';
}
