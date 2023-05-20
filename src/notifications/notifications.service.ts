import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import axios from 'axios';
import * as Pushover from 'pushover-notifications';
import { configService } from 'src/config/config.service';
import { User } from 'src/models';

@Injectable()
export class NotificationsService {
  private readonly pushover: Pushover;

  constructor(private readonly mailerService: MailerService) {
    this.pushover = new Pushover({
      user: configService.get('PUSHOVER_USER_KEY'),
      token: configService.get('PUSHOVER_APP_TOKEN'),
    });
  }

  private async sendNotification(data: any) {
    try {
      if (data.webhook) {
        const res = await axios.post(data.webhook, { message: data.message });
        if (res.status.toString().startsWith('2')) {
          console.log('Webhook notification sent successfully');
        } else {
          throw new Error('Could not send webhook notification');
        }
      }

      if (data.user.emailNotification) {
        const result = await this.mailerService.sendMail({
          to: data.user.email,
          subject: data.title,
          template: data.emailTemplate,
          context: { name: data.user.name, url: data.url },
        });

        if (!result || !result.messageId) {
          throw new Error('Could not send email notification');
        }
      }

      if (data.user.pushoverNotification) {
        const message = {
          message: data.message,
          title: data.title,
          priority: 1,
        };
        this.pushover.send(message, (error: any) => {
          if (error) {
            throw new Error('Could not send pushover notification pushover');
          }
        });
      }

      return true;
    } catch (error) {
      console.log(error);
    }
  }

  async sendUpNotification(user: User, url: string, webhook?: string) {
    const data = {
      user: {
        emailNotification: user.emailNotification,
        pushoverNotification: user.pushoverNotification,
        email: user.email,
        name: user.name,
      },
      url,
      webhook: webhook || null,
      title: 'Your website is up!',
      message: `Your website ${url} is up!`,
      emailTemplate: 'url-up',
    };

    return await this.sendNotification(data);
  }

  async sendDownNotification(user: User, url: string, webhook?: string) {
    const data = {
      user: {
        emailNotification: user.emailNotification,
        pushoverNotification: user.pushoverNotification,
        email: user.email,
        name: user.name,
      },
      url,
      webhook: webhook || null,
      title: 'Your website is down!',
      message: `Your website ${url} is down!`,
      emailTemplate: 'url-down',
    };

    return await this.sendNotification(data);
  }
}
