import { supabase } from "../services/supabase.js";
import {
  sendAdminNotification,
  sendAutoReply,
} from "../services/mail.service.js";

export const submitContact = async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      subject,
      message,
      ip_address: req.ip,
      user_agent: req.headers["user-agent"],
    });

    if (error) throw error;

    await sendAdminNotification({ name, email, subject, message });

    await sendAutoReply({ name, email });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (err) {
    console.error("Contact error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
