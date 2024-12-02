import { Announcement } from "../models/announcement.model.js";
import { Class } from "../models/class.model.js";


const getAnnouncement = async (req, res) => {
  try {
    const { subject } = req.params;
    const cls = await Class.findOne({ subject });

    if (!cls) {
      return res.status(404).json({ message: 'Class not found' });
    }

    const allAnnouncements = await Announcement.find({
      _id: { $in: cls.announcements }
    }).populate('createdBy') 
      .populate('replies.user') 
      .exec();

    res.status(200).json({ announcements: allAnnouncements });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createAnnouncement = async (req, res) => {
  try {
    const { title, content, subject, user } = req.body;
    const cls = await Class.findOne({ subject });

    if (!cls) {
      throw new Error('Class not found');
    }

    if (!cls.teacher.equals(user._id)) {
      throw new Error('Only the class teacher can create announcements');
    }


    if (!cls.announcements) {
      cls.announcements = [];
    }

    const announcement = new Announcement({
      title,
      content,
      createdBy: user._id,
    });

    cls.announcements.push(announcement);
    await announcement.save();
    await cls.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const deleteAnnouncement = async (subject, announcementId) => {
  const cls = await Class.findOne(subject);
  if (!cls) {
    throw new Error('Class not found');
  }

  const announcement = cls.announcements.id(announcementId);
  if (!announcement) {
    throw new Error('Announcement not found');
  }

  if (!cls.teacher.equals(req.user._id)) {
    throw new Error('Only the class teacher can delete announcements');
  }

  cls.announcements.pull(announcement);
  await cls.save();
  return announcement;
}

const updateAnnouncement = async (req, res) => {
  try {
    const anid = req.params.id;
    const { content, user } = req.body;
    // console.log(anid, content, user);
    const announcement = await Announcement.findByIdAndUpdate(
      anid,
      {
        $push: {
          replies: {
            user: user,
            content: content
          }
        }
      },
      { new: true }
    );

    if (!announcement) {
      return res.status(404).json({ message: "Announcement not found" });
    }

    res.status(200).json(announcement);
  } catch (error) {
    console.error("Error updating announcement:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export {
  getAnnouncement,
  updateAnnouncement,
  createAnnouncement,
  deleteAnnouncement,
};