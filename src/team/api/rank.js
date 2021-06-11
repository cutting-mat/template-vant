import {instance} from '@/api';

// 进度排名
export const progressRank = params => {
  return instance.get(`/p51/rank/progress/s`, {params})
}

// 团队投票排名
export const teamVotesRank = params => {
  return instance.get(`/p51/rank/teamVotes/s`, {params})
}

// 作品投票排名
export const workVotesRank = params => {
  return instance.get(`/p51/rank/workVotes/s`, {params})
}
