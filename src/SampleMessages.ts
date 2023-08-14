export const sampleMessage = [
  {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '112694378585634',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '18023836625',
                phone_number_id: '110260575498033',
              },
              contacts: [
                {
                  profile: { name: 'Alexandre Tolstenko' },
                  wa_id: '18023794094',
                },
              ],
              messages: [
                {
                  from: '18023794094',
                  id: 'wamid.HBgLMTgwMjM3OTQwOTQVAgASGBYzRUIwRjFENUIzOUQ5NDE3OTNCNDM3AA==',
                  timestamp: '1692033425',
                  text: { body: 'aoeaoeuaoeuaoeuaoeuaoeuaoeuaoeu' },
                  type: 'text',
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
    ],
  },

  {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '112694378585634',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '18023836625',
                phone_number_id: '110260575498033',
              },
              statuses: [
                {
                  id: 'wamid.HBgLMTgwMjM3OTQwOTQVAgARGBI2RDk3M0I3RUI1MzY1MDVCRDcA',
                  status: 'sent',
                  timestamp: '1692033428',
                  recipient_id: '18023794094',
                  conversation: {
                    id: '653d103d567c81982daf2cf8bc137279',
                    expiration_timestamp: '1692119880',
                    origin: { type: 'service' },
                  },
                  pricing: {
                    billable: true,
                    pricing_model: 'CBP',
                    category: 'service',
                  },
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
    ],
  },

  {
    object: 'whatsapp_business_account',
    entry: [
      {
        id: '112694378585634',
        changes: [
          {
            value: {
              messaging_product: 'whatsapp',
              metadata: {
                display_phone_number: '18023836625',
                phone_number_id: '110260575498033',
              },
              statuses: [
                {
                  id: 'wamid.HBgLMTgwMjM3OTQwOTQVAgARGBI2RDk3M0I3RUI1MzY1MDVCRDcA',
                  status: 'delivered',
                  timestamp: '1692033428',
                  recipient_id: '18023794094',
                  conversation: {
                    id: '653d103d567c81982daf2cf8bc137279',
                    origin: { type: 'service' },
                  },
                  pricing: {
                    billable: true,
                    pricing_model: 'CBP',
                    category: 'service',
                  },
                },
              ],
            },
            field: 'messages',
          },
        ],
      },
    ],
  },
];
