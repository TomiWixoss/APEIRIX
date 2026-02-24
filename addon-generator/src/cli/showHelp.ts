import chalk from 'chalk';

export function showHelp(): void {
  console.log(chalk.cyan('\n📚 APEIRIX Addon Generator v2.0\n'));
  console.log('Commands:');
  console.log(chalk.yellow('  apeirix item -i <id> -n <name> -t <texture>'));
  console.log(chalk.yellow('  apeirix block -i <id> -n <name> -t <texture>'));
  console.log(chalk.yellow('  apeirix ore -i <id> -n <name> -t <texture> --raw-item <id>'));
  console.log(chalk.yellow('  apeirix tool:pickaxe -i <id> -n <name> -t <texture> --material <id>'));
  console.log(chalk.yellow('  apeirix armor --base-name <name> --display-name <name> --material <id> --icons <path> --layer1 <path> --layer2 <path>'));
  console.log(chalk.yellow('  apeirix batch -f <config.yaml>'));
  console.log(chalk.yellow('  apeirix recipe:shaped --id <id> --pattern <json> --key <json> --result <item>'));
  console.log(chalk.yellow('  apeirix recipe:shapeless --id <id> --ingredients <items> --result <item>'));
  console.log(chalk.yellow('  apeirix recipe:smelting --id <id> --input <item> --output <item>'));
  console.log(chalk.yellow('  apeirix undo'));
  console.log(chalk.yellow('  apeirix history\n'));
  
  console.log('Ví dụ:');
  console.log(chalk.gray('  # Tạo item'));
  console.log(chalk.gray('  apeirix item -i magic_stone -n "Đá Ma Thuật" -t ./texture.png\n'));
  
  console.log(chalk.gray('  # Tạo ore với world gen'));
  console.log(chalk.gray('  apeirix ore -i copper_ore -n "Quặng Đồng" -t ./ore.png --raw-item raw_copper --deepslate-texture ./deepslate.png\n'));
  
  console.log(chalk.gray('  # Tạo tool (không có recipe)'));
  console.log(chalk.gray('  apeirix tool:pickaxe -i copper_pickaxe -n "Cuốc Đồng" -t ./pickaxe.png --material copper_ingot\n'));
  
  console.log(chalk.gray('  # Tạo armor set'));
  console.log(chalk.gray('  apeirix armor --base-name copper --display-name "Giáp Đồng" --material copper_ingot --icons ./armor/ --layer1 ./layer1.png --layer2 ./layer2.png\n'));
  
  console.log(chalk.gray('  # Batch từ config'));
  console.log(chalk.gray('  apeirix batch -f content.yaml\n'));
  
  console.log(chalk.gray('  # Dry run'));
  console.log(chalk.gray('  apeirix ore -i test -n "Test" -t ./test.png --raw-item raw_test --dry-run\n'));
  
  console.log(chalk.gray('  # Undo'));
  console.log(chalk.gray('  apeirix undo\n'));
  
  console.log('Flags:');
  console.log(chalk.gray('  --dry-run    Preview changes without creating files'));
  console.log(chalk.gray('  -p <path>    Project root (default: current directory)\n'));
}
