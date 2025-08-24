const Car = require('../models/Car');

const getMarkaSeriModelHierarchyWithCounts = async (req, res) => {
  try {
    const data = await Car.aggregate([
      {
        $group: {
          _id: {
            marka: "$marka",
            seri: "$seri",
            model: "$model"
          },
          count: { $sum: 1 }
        }
      }
    ]);

    const hierarchy = {};

    data.forEach(({ _id, count }) => {
      const { marka, seri, model } = _id;

      if (!hierarchy[marka]) {
        hierarchy[marka] = { count: 0, seriler: {} };
      }
      hierarchy[marka].count += count;

      const seriKey = seri || "Genel";
      if (!hierarchy[marka].seriler[seriKey]) {
        hierarchy[marka].seriler[seriKey] = { count: 0, modeller: {} };
      }
      hierarchy[marka].seriler[seriKey].count += count;

      const modelKey = model || "Bilinmeyen";
      if (!hierarchy[marka].seriler[seriKey].modeller[modelKey]) {
        hierarchy[marka].seriler[seriKey].modeller[modelKey] = 0;
      }
      hierarchy[marka].seriler[seriKey].modeller[modelKey] += count;
    });

    res.json(hierarchy);
  } catch (error) {
    res.status(500).json({ message: "Hiyerarşi verisi alınamadı", error });
  }
};

module.exports = { getMarkaSeriModelHierarchyWithCounts };
