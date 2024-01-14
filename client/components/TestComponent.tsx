'use client'

import axios from "axios"
import { SERVER_URL } from "client/constants/server-config"
import { useEffect } from "react"

const TestComponent = () => {
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${SERVER_URL}/health_check`);

      return res.data;
    }

    fetchData();
  }, [])

  return (
    <>

    </>
  )
}

export default TestComponent;
