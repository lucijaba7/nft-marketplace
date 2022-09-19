import { useState, useEffect } from 'react'
import { ethers } from "ethers"
import { Row, Col, Card } from 'react-bootstrap'

export default function Sales({ marketplace, nft, account }) {
  const [loading, setLoading] = useState(true)
  const [soldItems, setSoldItems] = useState([])

  const loadSoldItems = async () => {
    const itemIds = await marketplace.itemIds()
    let soldItems = []

    for (let idx = 1; idx <= itemIds; idx++) {
      const i = await marketplace.idToItem(idx)

      if (i.seller.toLowerCase() !== account) continue;
      if (!i.sold) continue;

      const uri = await nft.tokenURI(i.tokenId)
      const response = await fetch(uri)
      const metadata = await response.json()
      const totalPrice = await marketplace.getTotalPrice(i.itemId)

      let item = {
        totalPrice,
        price: i.price,
        itemId: i.itemId,
        name: metadata.name,
        description: metadata.description,
        image: metadata.image
      }

      soldItems.push(item)
    }
    setLoading(false)
    setSoldItems(soldItems)
  }
  useEffect(() => {
    loadSoldItems()
  }, [])
  if (loading) return (
    <main style={{ padding: "1rem 0" }}>
      <h2>Loading...</h2>
    </main>
  )
  return (
    <div className="flex justify-center">
      {soldItems.length > 0 ?
        <div className="px-5 py-3 container">
          <h2>Sold</h2>
          <Row xs={1} md={2} lg={4} className="g-4 py-3">
            {soldItems.map((item, idx) => (
              <Col key={idx} className="overflow-hidden">
                <Card>
                  <Card.Img variant="top" src={item.image} />
                  <Card.Footer>
                    For {ethers.utils.formatEther(item.totalPrice)} ETH - Recieved {ethers.utils.formatEther(item.price)} ETH
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
        : (
          <main style={{ padding: "1rem 0" }}>
            <h2>No sold assets</h2>
          </main>
        )}
    </div>
  );
}