import type { Phong } from './entity'

export interface SessionData {
  maPhien: string
  maPin: string
  phong: Phong
}

export interface NavigateData {
  trangIndex: number
}

export interface QuestionStartedData {
  trangIndex: number
}

export interface MemberJoinedData {
  tenThanhVien: string
  maThanhVienPhien: string
}

export interface MemberLeftData {
  maThanhVienPhien: string
}

export interface AnswerSubmittedData {
  maThanhVienPhien: string
  correct?: boolean
}

export interface LeaderboardData {
  leaderboard: Array<{
    tenThanhVien: string
    diem: number
    rank: number
  }>
}

export interface SubmitAnswerPayload {
  maLuaChon: string
  thoiGian: number
}

export interface JoinSessionPayload {
  maPin: string
  tenThanhVien: string
}

export interface CreateSessionPayload {
  maPhong: string
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'

export enum SocketEvent {
  // Session events
  CREATE_PHIEN = 'phien:create',
  JOIN_PHIEN = 'phien:join',
  LEAVE_PHIEN = 'phien:leave',
  END_PHIEN = 'phien:end',

  // Navigation events
  NAVIGATE = 'phien:navigate',
  NAVIGATED = 'phien:navigated',

  // Question events
  START_QUESTION = 'phien:startQuestion',
  QUESTION_STARTED = 'phien:questionStarted',
  SUBMIT_ANSWER = 'phien:submitAnswer',
  ANSWER_SUBMITTED = 'phien:answerSubmitted',

  // Leaderboard events
  SHOW_LEADERBOARD = 'phien:showLeaderboard',
  LEADERBOARD = 'phien:leaderboard',

  // Member events
  MEMBER_JOINED = 'phien:memberJoined',
  MEMBER_LEFT = 'phien:memberLeft',

  // Status events
  STARTED = 'phien:started',
  ENDED = 'phien:ended',

  // System events
  ERROR = 'error',
  DISCONNECT = 'disconnect',
}
