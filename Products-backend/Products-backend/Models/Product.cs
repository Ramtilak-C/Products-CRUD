﻿using System;
namespace Products_backend.Models
{
	public class Product
	{
		public int ID { get; set; }

		public string ProductID { get; set; } = null!;

		public string? Name { get; set; }

		public string? Brand { get; set; }

        public string? Price { get; set; }
    }
}

