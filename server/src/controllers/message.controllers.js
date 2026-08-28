import Message from '../models/Message.Model.js';

export const getMessagesForProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    console.log(projectId)
    const messages = await Message.find({ project: projectId })
      .populate('sender', 'name')
      .sort({ createdAt: 1 });
console.log(messages)
    res.status(200).json({ messages });
  } catch (err) {   
    console.error(err);
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

export const postMessage = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { content, text } = req.body;
    const userId = req.user.id || req.user._id;
    const messageText = content || text;

    if (!messageText?.trim()) {
      return res.status(400).json({ message: "Message content cannot be empty" });
    }

    const message = await Message.create({
      project: projectId,
      sender: userId,
      text: messageText.trim(),
    });

    const populated = await Message.findById(message._id).populate('sender', 'name avatar');

    res.status(201).json({ message: populated, success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post message", success: false });
  }
};