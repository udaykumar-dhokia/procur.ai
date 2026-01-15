const topicName = process.env.GMAIL_TOPIC_NAME;

const startGmailWatch = async () => {
  if (topicName) {
    try {
      const { gmailService } = await import("../services/gmail.service.js");
      await gmailService.watch(topicName);
    } catch (err) {
      console.error("Failed to start Gmail watch:", err.message);
    }
  } else {
    console.warn(
      "GMAIL_TOPIC_NAME not set. Push notifications will not be active."
    );
  }
};

export default startGmailWatch;
