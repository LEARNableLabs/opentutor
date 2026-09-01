/**
 * Email channel — send lessons and progress reports via Resend.
 */

import { Resend } from 'resend';

export class EmailChannel {
  constructor(options = {}) {
    this.client = new Resend(options.apiKey || process.env.RESEND_API_KEY);
    this.from = options.from || process.env.RESEND_FROM || 'OpenTutor <tutor@opentutor.dev>';
    this.to = options.to || process.env.RESEND_TO;
  }

  async sendLesson(subject, html) {
    if (!this.to) throw new Error('RESEND_TO not configured');
    return this.client.emails.send({
      from: this.from,
      to: this.to,
      subject,
      html,
    });
  }

  async sendProgressReport(stats) {
    if (!this.to) throw new Error('RESEND_TO not configured');

    const html = [
      '<h2>Your OpenTutor Progress Report</h2>',
      '<table style="border-collapse:collapse;width:100%">',
      stats.topics?.map((t) =>
        `<tr><td style="padding:8px;border-bottom:1px solid #eee"><b>${t.topic}</b></td>` +
        `<td style="padding:8px;border-bottom:1px solid #eee">${t.completed}/${t.total} (${t.percent}%)</td></tr>`
      ).join('') || '<tr><td>No topics yet</td></tr>',
      '</table>',
    ].join('');

    return this.client.emails.send({
      from: this.from,
      to: this.to,
      subject: 'Your OpenTutor Progress Report',
      html,
    });
  }

  async sendNotification(subject, text) {
    if (!this.to) throw new Error('RESEND_TO not configured');
    return this.client.emails.send({
      from: this.from,
      to: this.to,
      subject,
      text,
    });
  }
}
