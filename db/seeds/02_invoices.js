exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("invoices").del();
  await knex("invoices").insert([
    {
      payment_request: "lnbcrt1u1p...",
      memo: "yo",
      value: 100,
      settled: false,
      send: false,
      user_id: 1,
    },
    {
      payment_request: "lnbcrt2u1p...",
      value: 100,
      fees: 10,
      send: true,
      settled: true,
      settle_date: knex.fn.now(),
      user_id: 2,
    },
  ]);
};
