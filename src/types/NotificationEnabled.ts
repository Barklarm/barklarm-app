export type NotificationsConfiguration = {
    datetime: Array<NotificationConfiguration>;
};

export type NotificationConfiguration = {
    weekday: number;
    enableTime: number;
    disableTime: number;
};