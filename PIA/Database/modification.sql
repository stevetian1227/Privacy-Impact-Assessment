INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('1', 'Accidental Sharing', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('2', 'Overworked Cybersecurity Teams', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('3', 'Employee Data Theft', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('4', 'Ransomware', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('5', 'Bad Password Hygiene', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('6', 'Bribery', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('7', 'Too Much Data Access', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('8', 'Fraud', '1');
INSERT INTO `
PIA`.`Threat
`
(`idThreat`, `Threatname`, `Threatcategory`) VALUES
('9', 'Denial', '1');

SELECT Threatname
FROM PIA.Threat;

Alter TABLE PIA.Control MODIFY COLUMN Controlname VARCHAR
(200);

INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('1', 'Identity and Access Management (IDAM)');
INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('2', 'Data Loss Prevention (DLP)');
INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('3', 'Encryption & Pseudonymization');
INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('4', 'Incident Response Plan (IRP)');
INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('5', 'Third-Party Risk Management');
INSERT INTO `
PIA`.`Control
`
(`idControl`, `Controlname`) VALUES
('6', 'Policy Management');

