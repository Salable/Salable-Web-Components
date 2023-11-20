# salable-invoices

<!-- Auto Generated Below -->


## Properties

| Property           | Attribute           | Description                                                             | Type     | Default     |
| ------------------ | ------------------- | ----------------------------------------------------------------------- | -------- | ----------- |
| `apiKey`           | `api-key`           | The publishable api key, this can be generated in the Salable dashboard | `string` | `undefined` |
| `limit`            | `limit`             | The number of rows to display per page                                  | `number` | `25`        |
| `subscriptionUuid` | `subscription-uuid` | The uuid of the subscription that you want to display invoices for.     | `string` | `undefined` |


## Dependencies

### Depends on

- [salable-status](../common/salable-status)
- [salable-date](../common/salable-date)

### Graph
```mermaid
graph TD;
  salable-invoices --> salable-status
  salable-invoices --> salable-date
  style salable-invoices fill:#f9f,stroke:#333,stroke-width:4px
```

----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
