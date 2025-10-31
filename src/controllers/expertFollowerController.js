const Follower = require('../models/expertFollowerModel');

// ✅ Follow Expert
exports.followExpert = (req, res) => {
  const { user_id, expert_id } = req.body;

  if (!user_id || !expert_id)
    return res.status(400).json({ message: 'user_id and expert_id are required' });

  Follower.followExpert(user_id, expert_id, (err) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ message: 'Already following this expert' });
      }
      return res.status(500).json({ error: err });
    }

    res.status(200).json({ message: '✅ Expert followed successfully' });
  });
};

// ✅ Unfollow Expert
exports.unfollowExpert = (req, res) => {
  const { user_id, expert_id } = req.body;

  if (!user_id || !expert_id)
    return res.status(400).json({ message: 'user_id and expert_id are required' });

  Follower.unfollowExpert(user_id, expert_id, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Not following this expert' });

    res.status(200).json({ message: '✅ Unfollowed successfully' });
  });
};

// ✅ Get Followers for an Expert
exports.getFollowers = (req, res) => {
  const { expert_id } = req.params;

  if (!expert_id)
    return res.status(400).json({ message: 'expert_id is required' });

  Follower.getFollowersByExpert(expert_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    res.status(200).json({
      message: '✅ Followers fetched successfully',
      total_followers: results.length,
      followers: results
    });
  });
};
