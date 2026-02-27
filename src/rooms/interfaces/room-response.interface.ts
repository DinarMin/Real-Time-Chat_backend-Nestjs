export interface IParticipant {
  id: string;
  user: { id: string };
  role: string;
}

export interface IParticipantRes {
  id: string;
  userId: string;
  role: string;
}

export interface IRoomResponse {
  room: {
    id: string;
    name: string;
    type: string;
  };
  participant: IParticipantRes[];
  firstMessage: {
    id: string;
    text: string;
    type: string;
    roomId: string;
    senderId: string;
  };
}
