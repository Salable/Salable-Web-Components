import { Component, h, Host, Prop } from '@stencil/core';
import { StatusType } from '../../../enums/status-type';

@Component({
  tag: 'salable-status',
  styleUrl: 'salable-status.css',
  shadow: false,
})
export class SalableStatus {
  /**
   * The status type
   **/
  @Prop() statusType = StatusType.SUCCESS;

  getSvg() {
    if (this.statusType === StatusType.SUCCESS) {
      return (
        <svg id="success-svg" class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
        </svg>
      );
    }
    if (this.statusType === StatusType.WARNING) {
      return (
        <svg id="warning-svg" class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"></path>
        </svg>
      );
    }
    if (this.statusType === StatusType.ERROR) {
      return (
        <svg id="error-svg" class="w-2.5 h-2.5" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z"></path>
        </svg>
      );
    }
  }

  getColour() {
    if (this.statusType === StatusType.SUCCESS) {
      return 'bg-green-100 text-green-800 dark:bg-green-900';
    }
    if (this.statusType === StatusType.WARNING) {
      return 'bg-orange-100 text-orange-800 dark:bg-orange-900';
    }
    if (this.statusType === StatusType.ERROR) {
      return 'bg-red-100 text-red-800 dark:bg-red-900';
    }
  }

  render() {
    return (
      <Host>
        <span class={`inline-flex items-center gap-1.5 py-0.5 px-2 rounded-full text-xs font-medium dark:text-green-200 ${this.getColour()}`}>
          {this.getSvg()}
          <slot></slot>
        </span>
      </Host>
    );
  }
}
