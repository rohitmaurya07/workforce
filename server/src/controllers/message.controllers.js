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
    const { content } = req.body;
    const userId = req.user._id; // assumes auth middleware sets req.user

    if (!content?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const message = await Message.create({ projectId, userId, content });
    const populated = await message.populate('userId', 'name');

    res.status(201).json({ message: populated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to post message" });
  }
};