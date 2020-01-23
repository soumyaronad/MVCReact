using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace MvcReactApp.Models
{
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        [StringLength(40, MinimumLength = 3)]
        [Required(ErrorMessage = "Please enter Product Name")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Please enter Product Price")]
        [DataType(DataType.Currency)]
        public decimal Price { get; set; }

        public List<Sales> Sales { get; set; }


    }
}
