export const getHospitalizations = (count, options = {}) => {
  const hospitalizations = []

  for (let index = 1; index <= count; index++) {
    const hospitalization = {
      id: index,
      patient: { id: options.patientId ?? index },
      service: { id: options.serviceId ?? index },
      admissionDate: `2025-01-${String(index).padStart(2, '0')}`,
      status: options.status ?? 'active',
      room: `Room ${index}`,
      bed: `Bed ${index}`
    }

    if (options.withoutPatient) {
      delete hospitalization.patient
    }

    if (options.withoutService) {
      delete hospitalization.service
    }

    if (options.emptyPatient) {
      hospitalization.patient = {}
    }

    if (options.emptyService) {
      hospitalization.service = {}
    }

    hospitalizations.push(hospitalization)
  }

  return hospitalizations
}

export const getHospitalization = (options = {}) => {
  return getHospitalizations(1, options)[0]
}

export const getPatients = (count) => {
  const patients = []

  for (let index = 1; index <= count; index++) {
    patients.push({
      id: index,
      firstname: `Patient${index}`,
      lastname: `LastName${index}`,
      birthdate: `1990-01-${String(index).padStart(2, '0')}`,
      email: `patient${index}@hospital.be`
    })
  }

  return patients
}

export const getServices = (count) => {
  const services = []

  for (let index = 1; index <= count; index++) {
    services.push({
      id: index,
      name: `Service ${index}`,
      code: `SRV${index}`,
      floor: index,
      capacity: 10 + index
    })
  }

  return services
}
