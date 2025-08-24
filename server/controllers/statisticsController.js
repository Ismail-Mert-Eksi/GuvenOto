// controller/statisticsController.js
const Car = require('../models/Car');

const getStatistics = async (req, res) => {
  try {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOf7Days = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7);

    // Paralel çalışsınlar:
    const [
      totalCount,
      todayCount,
      last7DaysCount,
      priceAgg,
      viewsAgg,
      topBrands,
      fuelDist,
      gearDist,
      mostViewed,
      recentCars,
      priceBuckets
    ] = await Promise.all([
      Car.countDocuments(),
      Car.countDocuments({ ilanTarihi: { $gte: startOfToday } }),
      Car.countDocuments({ ilanTarihi: { $gte: startOf7Days } }),
      Car.aggregate([
        { $group: {
          _id: null,
          sum: { $sum: "$fiyat" },
          avg: { $avg: "$fiyat" },
          min: { $min: "$fiyat" },
          max: { $max: "$fiyat" }
        }}
      ]),
      Car.aggregate([{ $group: { _id: null, totalViews: { $sum: "$ilanGoruntulenme" } } }]),
      Car.aggregate([
        { $group: { _id: "$marka", count: { $sum: 1 }, avgPrice: { $avg: "$fiyat" } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } },
        { $limit: 5 }
      ]),
      Car.aggregate([
        { $group: { _id: "$yakitTipi", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } }
      ]),
      Car.aggregate([
        { $group: { _id: "$vitesTipi", count: { $sum: 1 } } },
        { $match: { _id: { $ne: null } } },
        { $sort: { count: -1 } }
      ]),
      Car.find().sort({ ilanGoruntulenme: -1 }).limit(5).select("ilanNo ilanBasligi fiyat resimler ilanGoruntulenme marka"),
      Car.find().sort({ ilanTarihi: -1 }).limit(5).select("ilanNo ilanBasligi fiyat resimler ilanTarihi marka"),
      // Fiyat histogramı (bucket’lar ihtiyacına göre ayarlanabilir)
      Car.aggregate([
        { $bucket: {
          groupBy: "$fiyat",
          boundaries: [0, 50000, 100000, 200000, 400000, 800000, 1200000, 2000000],
          default: "2M+",
          output: { count: { $sum: 1 } }
        }}
      ])
    ]);

    const price = priceAgg[0] || { sum: 0, avg: 0, min: 0, max: 0 };
    const views = viewsAgg[0]?.totalViews || 0;

    res.json({
      toplamIlan: totalCount,
      bugunEklenen: todayCount,
      son7GunEklenen: last7DaysCount,
      fiyat: { toplam: price.sum || 0, ort: price.avg || 0, min: price.min || 0, max: price.max || 0 },
      toplamGoruntulenme: views,
      topMarkalar: topBrands.map(b => ({ marka: b._id, adet: b.count, ortFiyat: b.avgPrice || 0 })),
      yakitDagilimi: fuelDist.map(f => ({ yakitTipi: f._id, adet: f.count })),
      vitesDagilimi: gearDist.map(g => ({ vitesTipi: g._id, adet: g.count })),
      enCokGoruntulenen: mostViewed,
      sonIlk5: recentCars,
      fiyatHistogram: priceBuckets.map(b => ({
        aralik: typeof b._id === 'string' ? b._id : `${b._id}-${b._id + ''}`, // default olabilir
        _id: b._id,
        adet: b.count
      })),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'İstatistikler getirilemedi', error: String(error?.message || error) });
  }
};

module.exports = { getStatistics };
