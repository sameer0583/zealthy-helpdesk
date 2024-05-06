import { Migration } from '@mikro-orm/migrations';

export class InitialMigration extends Migration {

  async up(): Promise<void> {
    // Create the 'user' table
    this.addSql('CREATE TABLE `user` (' +
      '`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
      '`name` VARCHAR(255) NOT NULL,' +
      '`email` VARCHAR(255) NOT NULL UNIQUE,' +
      '`password` VARCHAR(255) NOT NULL,' +
      '`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
      '`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' +
    ') ENGINE=InnoDB;');

    // Create the 'ticket' table
    this.addSql('CREATE TABLE `ticket` (' +
      '`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
      '`name` VARCHAR(255) NOT NULL,' +
      '`email` VARCHAR(255) NOT NULL,' +
      '`description` TEXT NOT NULL,' +
      '`status` ENUM(\'new\', \'in_progress\', \'resolved\') NOT NULL,' +
      '`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
      '`updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP' +
    ') ENGINE=InnoDB;');

    // Create the 'response' table with foreign keys to 'ticket' and 'user'
    this.addSql('CREATE TABLE `response` (' +
      '`id` INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,' +
      '`description` TEXT NOT NULL,' +
      '`ticket_id` INT UNSIGNED NOT NULL,' +
      '`user_id` INT UNSIGNED NOT NULL,' +
      '`created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,' +
      'FOREIGN KEY (`ticket_id`) REFERENCES `ticket`(`id`) ON DELETE CASCADE,' +
      'FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE' +
    ') ENGINE=InnoDB;');
  }
}