
const TestingROute = async (req, res) => {
  try {
    res.status(200).json({ testing: "/ route testing" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default TestingROute;
