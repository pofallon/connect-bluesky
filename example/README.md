## Example Express application

To run this express application with connect-bluesky:

1. Clone this github repo
1. Change into the `example` directory and run `npm update`
1. Edit `app.js` and set your azure storage account and key
1. Ensure that the `sessions` table already exists in this storage account (due to a bug, for now)
1. Run the express application via `node app.js`
1. Visit the `/items` URL and add some items -- these will be stored in your session in Azure table storage via connect-bluesky
1. (optional) Confirm with a storage explorer that the items are indeed in the `sessions` table.