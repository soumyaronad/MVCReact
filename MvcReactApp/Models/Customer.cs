using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace MvcReactApp.Models
{
    public class Customer
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [StringLength(20, MinimumLength = 3)]
        [Required(ErrorMessage = "Please enter Customer Name")]
        public string Name { get; set; }

        [StringLength(100, MinimumLength = 3)]
        [Required(ErrorMessage = "Please enter Customer Address")]
        public string Address { get; set; }

        public List<Sales> Sales { get; set; }
    
}
}
