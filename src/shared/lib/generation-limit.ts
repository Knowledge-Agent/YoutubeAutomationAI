export function getGenerationLimitCopy(mediaType: 'image' | 'video') {
  if (mediaType === 'image') {
    return {
      title: "You've used today's image generations",
      description:
        'Your daily image allowance is fully used for today. You can create up to 3 images per day, and the limit resets on the next Asia/Shanghai day.',
    };
  }

  return {
    title: "You've used today's video generations",
    description:
      'Your daily video allowance is fully used for today. You can create up to 1 video per day, and the limit resets on the next Asia/Shanghai day.',
  };
}
