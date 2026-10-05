export const RedisKeys = {
  categories: {
    all: 'categories:all',
  },

  ads: {
    list: 'ads:list:*',

    detail: (id: string) => `ads:detail:${id}`,
  },
};