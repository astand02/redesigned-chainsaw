const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint
// http://localhost:3001/api/tag
router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findAll({
      include: {
        model: Product,
        attributes: ['product_name', 'price', 'stock', 'category_id']
      }
    });

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});
// http://localhost:3001/api/tag/2
router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: Tag, as: 'category_product' }]
    });

    if (!tagData) {
      res.status(404).json({ message: 'No tag found with this id!' });
      return;
    }

    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post('/', async (req, res) => {
  // create a new tag
  try {
    const tagData = await Tag.create(req.body);
    res.status(200).json(tagData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// http://localhost:3001/api/tag/3
router.put('/:id', (req, res) => {
  // update a tag's name by its `id` value
    Tag.update(req.body, 
      {
        tag_name: req.body.tag_name
      },
      {
      where: {
        id: req.params.id,
      },
    })
      .then((tagData) => {
        if(!tagData) {
            res.status(404).json({ message: 'No tag found under this id!'});
            return;
          }
          res.json(tagData);
        })

      .catch((err) => {
        console.log(err);
        res.status(400).json(err);
      });
});

// http://localhost:3001/api/tag/3
router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value
  try {
    const tagData = await Tag.destroy({
      where: { id: req.params.id }
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found under this id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
