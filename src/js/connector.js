var GRAY_ICON =
  "https://cdn.hyperdev.com/us-east-1%3A3d31b21c-01a0-4da2-8827-4bc6e88b7618%2Ficon-gray.svg";

window.TrelloPowerUp.initialize({
  "card-badges": function (t, opts) {
    //    let cardAttachments = opts.attachments; // Trello passes you the attachments on the card
    return t.card("all").then(function (card) {
      console.log(card);
      return [
        {
          text: card.idShort,
        },
      ];
    });
  },
  "attachment-sections": function (t, options) {
    // options.entries is a list of the attachments for this card
    // you can look through them and 'claim' any that you want to
    // include in your section.

    // we will just claim urls for Yellowstone
    var claimed = options.entries.filter(function (attachment) {
      return attachment.url.indexOf("http://www.nps.gov/yell/") === 0;
    });

    // you can have more than one attachment section on a card
    // you can group items together into one section, have a section
    // per attachment, or anything in between.
    if (claimed && claimed.length > 0) {
      // if the title for your section requires a network call or other
      // potentially lengthy operation you can provide a function for the title
      // that returns the section title. If you do so, provide a unique id for
      // your section
      return [
        {
          id: "Yellowstone", // optional if you aren't using a function for the title
          claimed: claimed,
          icon: GRAY_ICON, // Must be a gray icon, colored icons not allowed.
          title: "Example Attachment Section: Yellowstone",
          content: {
            type: "iframe",
            url: t.signUrl("../section.html", {
              arg: "you can pass your section args here",
            }),
            height: 230,
          },
        },
      ];
    } else {
      return [];
    }
  },
});
