import {Component, Element, h, Host, Prop, State} from '@stencil/core';
import format from 'date-fns/format';

@Component({
  tag: 'salable-date',
  styleUrl: 'salable-date.css',
  shadow: true,
})
export class SalableDate {
  /**
   * The date to display
   **/
  @Prop() date: string | number;

  @Element() hostElement: HTMLSalableDateElement;

  @State() isLongFormat: boolean = false;

  private resizeObserver: ResizeObserver;

  constructor() {
    this.updateFormat = this.updateFormat.bind(this);
  }

  componentWillLoad() {
    this.resizeObserver = new ResizeObserver(this.updateFormat);
    this.updateFormat();
  }

  componentDidLoad() {
    this.resizeObserver.observe(this.hostElement);
  }

  disconnectedCallback() {
    this.resizeObserver.disconnect();
  }

  private updateFormat() {
    const width = this.hostElement.getBoundingClientRect().width;
    this.isLongFormat = width > 200;
  }

  private getDateFormat() {
    const dateFormat = this.isLongFormat ? 'dd MMMM yyyy' : 'dd-MM-Y';
    return format(new Date(this.date), dateFormat);
  }

  render() {
    return (
      <Host>
        <time dateTime={new Date(this.date).toISOString()} style={{width: '100%', display: 'block'}}>
          {this.getDateFormat()}
        </time>
      </Host>
    );
  }
}
