import { Subjects, Publisher, ExpirationCompleteEvent } from '@scstickets/common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
  
}