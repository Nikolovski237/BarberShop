using AutoMapper;
using Barber_Shop.DTOs;
using Barber_Shop.Models;

namespace Barber_Shop.Profiles
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<AppointmentCreateDTO, Appointment>();
            CreateMap<WorkingHour, WorkingHourDTO>().ReverseMap();
            CreateMap<Appointment, AppointmentDTO>()
                .ForMember(dest => dest.BarberName, opt => opt.MapFrom(src => src.Barber.FullName))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));
        }
    }

}
