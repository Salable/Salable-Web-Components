# salable-pricing-table



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute     | Description                                                                                                                  | Type     | Default     |
| ------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------- | -------- | ----------- |
| `apiKey` _(required)_     | `api-key`     | A unique identifier to authenticate HTTP calls to Salable API                                                                | `string` | `undefined` |
| `email`                   | `email`       | A user's email address to be used for the checkout.  Providing the user's email skips the provide email step during checkout | `string` | `undefined` |
| `granteeId` _(required)_  | `grantee-id`  | A unique identifier used in licensing that represents the entity to which a license is granted                               | `string` | `undefined` |
| `member` _(required)_     | `member`      | A unique identifier for a member or user                                                                                     | `string` | `undefined` |
| `planUuid` _(required)_   | `plan-uuid`   | A unique identifier for a specific plan                                                                                      | `string` | `undefined` |
| `successUrl` _(required)_ | `success-url` | The URL the user is sent to if they successfully completed a payment                                                         | `string` | `undefined` |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
