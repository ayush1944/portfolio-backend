import { supabase } from '../services/supabase.js';

export const logEvent = async (req, res) => {
  try {
    const { event_type, payload } = req.body;
    if (!event_type) return res.status(400).json({ message: 'event_type required' });

    await supabase.from('analytics_events').insert({
      event_type,
      payload: payload ?? null,
      ip_address: req.ip,
      user_agent: req.headers['user-agent'],
      referrer: req.headers['referer'] ?? null,
    });

    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getSummary = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('analytics_events')
      .select('event_type, payload, user_agent, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;

    // Totals per event type
    const totals = { page_view: 0, project_click: 0, contact_submit: 0 };
    const projectMap = {};
    const browserMap = {};

    for (const row of data) {
      if (totals[row.event_type] !== undefined) totals[row.event_type]++;

      // Project click breakdown
      if (row.event_type === 'project_click' && row.payload?.title) {
        projectMap[row.payload.title] = (projectMap[row.payload.title] || 0) + 1;
      }

      // Browser name from user-agent
      const ua = row.user_agent || '';
      let browser = 'Other';
      if (ua.includes('Edg/'))          browser = 'Edge';
      else if (ua.includes('OPR/'))     browser = 'Opera';
      else if (ua.includes('Chrome/'))  browser = 'Chrome';
      else if (ua.includes('Firefox/')) browser = 'Firefox';
      else if (ua.includes('Safari/'))  browser = 'Safari';
      browserMap[browser] = (browserMap[browser] || 0) + 1;
    }

    const projects = Object.entries(projectMap)
      .map(([title, clicks]) => ({ title, clicks }))
      .sort((a, b) => b.clicks - a.clicks);

    const browsers = Object.entries(browserMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    res.json({
      totals,
      projects,
      browsers,
      recent: data.slice(0, 20),
    });
  } catch (err) {
    console.error('Analytics summary error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
