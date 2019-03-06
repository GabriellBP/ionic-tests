import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();


exports.newEventNotification = functions.database
  .ref('images')
  .onWrite(async (change: any, context: any) => {
    if (!change.after.val()) {
      console.log('Cancelling');
      return;
    }

    const tokensSnapshot = await admin.database()
      .ref('/tokens').once('value');

    // Check if there are any device tokens.
    if (!tokensSnapshot.hasChildren()) {
      console.log('There are no notification tokens to send to.');
      return ;
    }

    console.log('There are', tokensSnapshot.numChildren(), 'tokens to send notifications to.');

    // Notification content
    const payload = {
      notification: {
        title: 'Nova imagem',
        body: 'Nova imagem inserida',
        icon: 'https://goo.gl/Fz9nrQ'
      //  color and sound
      }
    };

    // Listing all tokens as an array.
    let tokens = Object.keys(tokensSnapshot.val()).map((key) => { return tokensSnapshot.val()[key]});
    console.log('tokens:', JSON.stringify(tokens));
    // Send notifications to all tokens.
    const response = await admin.messaging().sendToDevice(tokens, payload);
    // For each message check if there was an error.
    const tokensToRemove: any[] = [];
    response.results.forEach((result, index) => {
      const error = result.error;
      if (error) {
        console.error('Failure sending notification to', tokens[index], error);
        // Cleanup the tokens who are not registered anymore.
        if (error.code === 'messaging/invalid-registration-token' ||
          error.code === 'messaging/registration-token-not-registered') {
          tokensToRemove.push(tokensSnapshot.ref.child(tokens[index]).remove());
        }
      }
    });
    return Promise.all(tokensToRemove);
  });
