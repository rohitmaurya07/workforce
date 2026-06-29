export const employeePerformance =
  async (req, res) => {
    try {
      const data =
        await Task.aggregate([
          {
            $group: {
              _id:
                "$assignedTo",
              totalTasks: {
                $sum: 1,
              },
              completedTasks: {
                $sum: {
                  $cond: [
                    {
                      $eq: [
                        "$status",
                        "completed",
                      ],
                    },
                    1,
                    0,
                  ],
                },
              },
            },
          },
        ]);

      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message:
          error.message,
      });
    }
  };