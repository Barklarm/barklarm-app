export type NotificationsConfiguration = {
  datetime: Array<NotificationConfiguration>;
};

export type NotificationConfiguration = {
  weekday: number;
  enableTime: Time;
  disableTime: Time;
};

export type Time = {
  hour: number;
  minute: number;
};
