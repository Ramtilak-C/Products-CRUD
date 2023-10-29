using System;
using Microsoft.EntityFrameworkCore;

namespace Products_backend.Models
{
	public class ProductContext: DbContext
	{
		public ProductContext(DbContextOptions<ProductContext> options): base(options)
		{

		}

		public DbSet<Product> Products { get; set; }
	}
}

